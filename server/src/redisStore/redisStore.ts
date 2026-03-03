import config from '@/config/config'
import { createClient } from 'redis'

const REDIS_SERVER = process.env.REDIS_SERVER
const is_dev_mode = config.EVIRONMENT == "development"
// console.log(is_dev_mode, REDIS_SERVER)

export const pub = createClient({url: is_dev_mode ? 'redis://127.0.0.1:6379' : REDIS_SERVER})
export const sub = pub.duplicate()
export const redis = pub.duplicate()

;(async () => {
    try {
        await Promise.all([pub.connect(), sub.connect(), redis.connect()])
        await redis.flushAll()
        console.log("[Redis] connected to redis")
    } catch (error) {
        console.log(error, '--> redis')
    }
})()

redis.on('error', async (error) => {
    console.log("Error in redis ->", error)
    await redis.connect()
})

export const connectUser = async ({user_id, socket_id}: {user_id: string, socket_id: string}) => {
    await Promise.all([
        redis.sAdd(`user_id:${user_id}`, socket_id),
        // redis.set(`socket_id:${socket_id}`, user_id),
    ])
}

export const disconnectUser = async ({ user_id, socket_id }: {
    user_id: string, socket_id: string
}) => {
    // const user_id = await redis.get(`socket_id:${socket_id}`)
    if (user_id) {
        await redis.sRem(`user_id:${user_id}`, socket_id)
        const remaining = await redis.sCard(`user_id:${user_id}`) as number
        console.log(remaining, "remaining")
        if (remaining <= 0) {
            await redis.del(`user_id:${user_id}`)
        }
    }
}

export const userIdToSocketId = async (user_id: string) => {
    return await redis.sMembers(`user_id:${user_id}`)
}

// export const socketIdToUserId = async (socket_id) => {
//     return await redis.get(`socket_id:${socket_id}`)
// } // not needed

export const getUserStatus = async ( user_id: string ) => {
    if (!user_id) {
        console.log("user_id required -> getUserStatus()")
        return
    }
        const remaining = await redis.sCard(`user_id:${user_id}`) as number
        return remaining > 0 ? "online" : "offline"
}