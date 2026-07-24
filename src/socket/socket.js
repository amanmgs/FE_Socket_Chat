import { Platform } from 'react-native';
import { io } from 'socket.io-client';

// Android Emulator
// const URL = "http://10.0.2.2:3000";
//  'http://192.168.1.8:3000'; 

// iOS Simulator
const URL = Platform.OS === 'ios' ?  "http://localhost:3000" : "http://10.0.2.2:3000";

// Physical Device
// const URL = "http://YOUR_PC_IP:3000";

const socket = io(URL, {
  transports: ['websocket'],
  autoConnect: true,
});

export default socket;
