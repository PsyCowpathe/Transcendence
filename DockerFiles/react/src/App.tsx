
import {useState, createContext } from 'react'
import { BrowserRouter} from 'react-router-dom'
import {  Routes, Route } from 'react-router-dom';
import LoadingPage from "./Pages/LoadingPage";
import HomePage  from './Pages/HomePage';
import { ChangeLogin } from "./Pages/LoginPage";
import "./css/List.css"; 
import "./css/NavLink.css"; 
import "./css/TopBar.css"
import 'react-toastify/dist/ReactToastify.css';


import {AffMyUserPage} from "./Pages/UserPage";
import { Chat } from './chat/Chat';
import  ProfilePictureUploader  from './Pages/NewProfilPic';
import NotFound from './Pages/404NotFound';
import { TestLog } from './Pages/ForceLog';  
import { Resend2FA } from './Pages/Resend2FA';
import PongGame from './pong/Pong' 
import PongMenu from './pong/PongMenu' 
import EndScreen from './pong/EndScreen' 

function App() 
{
	  const [isLoggedIn, setIsLoggedIn] = useState(false);

	if ( isLoggedIn)
	{
		setIsLoggedIn(false);
	}
	
	interface TokenForm
	{
		code : string | null;
		state : string | null
	}
	
	const [tokenForm, setToken] = useState<TokenForm>({state: null, code: null})


	return (
		<BrowserRouter> 
			<Routes>
			<Route path='/change' element={<ChangeLogin/>}/> 
			<Route path='/log' element={<TestLog/>}/>
			<Route path='/' element={<HomePage tokenForm={tokenForm} setToken={setToken} onLogin={() => setIsLoggedIn(true)}/>}/> 
			<Route path='/chat' element={<Chat/>}/>
			<Route path='/affUser' element={<AffMyUserPage ShowBar={true}/>}/>
			<Route path='/LoadingPage' element={<LoadingPage/>}/>
			<Route path='/Send2FA' element={<Resend2FA />}/>
			<Route path='/*' element={<NotFound />}/> 
			<Route path='/pong/menu' element={<PongMenu/>}/> 
			<Route path='/pong/play' element={<PongGame/>}/> 
			<Route path='/pong/endscreen' element={<EndScreen/>}/> 

			</Routes> 
	</BrowserRouter>
		);
}
	
	export default App;
	
