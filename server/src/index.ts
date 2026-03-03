import config from '@/config/config';
import server from './app';
import { connectDB } from './config/db';

const PORT = config.PORT || 8080;

// connect db
connectDB();

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});