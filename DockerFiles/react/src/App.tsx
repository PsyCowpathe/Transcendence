
import {useState, createContext } from 'react'
import { BrowserRouter} from 'react-router-dom'
import {  Routes, Route } from 'react-router-dom';
import LoadingPage from "./Pages/LoadingPage";
import HomePage  from './Pages/HomePage';
import { ChangeLogin } from "./Pages/LoginPage";
import "./css/List.css"; 
import "./css/NavLink.css"; 
import "./css/TopBar.css"
import {AffMyUserPage} from "./Pages/UserPage";
import { Chat } from './chat/Chat';
import  ProfilePictureUploader  from './Pages/NewProfilPic';
import NotFound from './Pages/404NotFound';
import { TestLog } from './Pages/ForceLog';  
import { Resend2FA } from './Pages/Resend2FA';
import Pong from './pong/Pong' 

function App() 
{
 const AuthContext = createContext(false);


	  const [isLoggedIn, setIsLoggedIn] = useState(false);

	  
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
			<Route path='/changepic' element={<ProfilePictureUploader />}/>
			<Route path='/Send2FA' element={<Resend2FA />}/>
			<Route path='/*' element={<NotFound />}/> 
			<Route path='/pong/menu' element={<PongMenu />}/> 
			<Route path='/pong/play' element={<Pong />}/> 
			<Route path='/pong/spectate' element={<Pong />}/> 

			</Routes> 
	</BrowserRouter>
		);
}
	
	export default App;
	
