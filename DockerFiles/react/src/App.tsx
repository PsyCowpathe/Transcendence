
import {useState, createContext } from 'react'
import { BrowserRouter} from 'react-router-dom'
import {  Routes, Route } from 'react-router-dom';
import LoadingPage from "./Pages/LoadingPage";
import HomePage  from './Pages/HomePage';
import { ChangeLogin } from "./Pages/LoginPage";
// import { Chat } from "./chat/ChatComp";
import "./css/List.css"; 
import "./css/NavLink.css"; 
import "./css/TopBar.css"
import MyNavLink from "./style/MynavLink";
import {AffMyUserPage} from "./Pages/UserPage";
import { AskFriend } from "./Pages/AskFrindPage";
import IconLabelButtons from './PageTest';
import { TopBar } from './Pages/TopBar';
// import { Chat } from './chat/ChatComp';
import { Chat } from './NewChat/CreateChan';
import  ProfilePictureUploader  from './Pages/NewProfilPic';
import NotFound from './Pages/404NotFound';
import { Set2FA } from './Pages/Set2FA';

  
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
			<Route path='/test2FA' element={<Set2FA/>}/> 
			<Route path='/' element={<HomePage tokenForm={tokenForm} setToken={setToken} onLogin={() => setIsLoggedIn(true)}/>}/> 
			<Route path='/chat' element={<Chat/>}/>
			{/* <Route path="/chatoune" element ={<Chat username={"Alice"} />} /> */}
			<Route path='/affUser' element={<AffMyUserPage ShowBar={true}/>}/>
			<Route path='/LoadingPage' element={<LoadingPage/>}/>
			<Route path='/changepic' element={<ProfilePictureUploader />}/>
			<Route  path='/askFriend' element={<AskFriend />}/>
			<Route path='/test' element={<IconLabelButtons />}/> 
			<Route path='/TopBar' element={<TopBar />}/> 
			<Route path='/*' element={<NotFound />}/> 
			</Routes> 
	</BrowserRouter>
		);
}
	
	export default App;
	