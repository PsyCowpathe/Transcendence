
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
import { AskFriend } from "./Pages/AskFrindPage";
import { TopBar } from './Pages/TopBar';
import { Chat } from './chat/Chat';
import  ProfilePictureUploader  from './Pages/NewProfilPic';
import NotFound from './Pages/404NotFound';
import { TestLog } from './Pages/ForceLog';  
import { Resend2FA } from './Pages/Resend2FA';
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
		 {/* <Route path='/' element={<HomePage  tokenForm={tokenForm} setToken={setToken} onLogin={() => setIsLoggedIn(true)}/>}/>   */}
			<Route path='/change' element={<ChangeLogin/>}/> 
			<Route path='/log' element={<TestLog/>}/>
			{/* <Route path='/test2FA' element={<Set2FA/>}/>  */}
			<Route path='/' element={<HomePage tokenForm={tokenForm} setToken={setToken} onLogin={() => setIsLoggedIn(true)}/>}/> 
			<Route path='/chat' element={<Chat/>}/>
			{/* <Route path="/chatoune" element ={<Chat username={"Alice"} />} /> */}
			<Route path='/affUser' element={<AffMyUserPage ShowBar={true}/>}/>
			<Route path='/LoadingPage' element={<LoadingPage/>}/>
			<Route path='/changepic' element={<ProfilePictureUploader />}/>
			<Route  path='/askFriend' element={<AskFriend />}/>
			<Route path='/TopBar' element={<TopBar />}/> 
			<Route path='/Send2FA' element={<Resend2FA />}/>
			<Route path='/*' element={<NotFound />}/> 
			</Routes> 
	</BrowserRouter>
		);
}
	
	export default App;
	