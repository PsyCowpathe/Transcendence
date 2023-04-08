
<<<<<<< HEAD
import { NavLink } from "react-router-dom";
import './css/App.css';
import {useState, useEffect} from 'react'
import axios from 'axios';
// import { CookiesProvider, useCookies } from 'react-cookie';
=======
import {useState, createContext } from 'react'
>>>>>>> origin/home
import { BrowserRouter} from 'react-router-dom'
import {  Routes, Route } from 'react-router-dom';
import LoadingPage from "./Pages/LoadingPage";
import HomePage  from './Pages/HomePage';
import { ChangeLogin } from "./Pages/LoginPage";
import { Chat } from "./chat/ChatComp";
import Pong from "./pong/Pong";
import "./css/List.css"; 
import "./css/NavLink.css"; 
import "./css/TopBar.css"
import MyNavLink from "./style/MynavLink";
<<<<<<< HEAD
import { AffMyUserPage } from "./Pages/UserPage";
// import ProfilePictureForm from "./Pages/NewProfilPic";


function App() 
{
=======
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
>>>>>>> origin/home


	  const [isLoggedIn, setIsLoggedIn] = useState(false);

	  
	interface TokenForm
	{
		code : string | null;
		state : string | null
	}
	
	const [tokenForm, setToken] = useState<TokenForm>({state: null, code: null})


	return (
<<<<<<< HEAD
		<BrowserRouter>
		<nav className="topbar">
		<li><MyNavLink to="/" label="Login"/></li>
		{/* <li><MyNavLink to="/change" label="change your login"/></li> */}
		<li><MyNavLink to="/chat" label="chat"/></li>
		<li><MyNavLink to="/affUser" label="My User page"/></li>
		<li><MyNavLink to="/Pong" label="My User page"/></li>
		{/* <li><MyNavLink to="/changepic" label="change my pic"/></li> */}
		</nav>
	
	<Routes>
				{/* <Switch>
        <Route exact path="/">
          {<HomePage  tokenForm={tokenForm} setToken={setToken}/>}
        </Route>
        <Route path="/change">
          {<ChangeLogin/>}
        </Route>
        <Route path="/chat">
          {<Chat/>}
        </Route>
		<Route path='/affUser'>
          {<AffMyUserPage/>}
        </Route>
      </Switch> */}
			<Route path='/' element={<HomePage  tokenForm={tokenForm} setToken={setToken}/>}/> 
			 <Route path='/change' element={<ChangeLogin/>}/> 
			 <Route path='/chat' element={<Chat/>}/>
			<Route path='/affUser' element={<AffMyUserPage/>}/>
			<Route path='/LoadingPage' element={<LoadingPage/>}/>
			{/* <Route path='/changepic' element={<ProfilePictureForm />}/> */}
			<Route path='/Pong' element={<Pong/>}/>
			</Routes>
		</BrowserRouter>
		
=======
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
>>>>>>> origin/home
		);
}
	
	export default App;
<<<<<<< HEAD
	


	// <div className="App">
	// 	<header className="App-header">
	// 	<img src={logo} className="App-logo" alt="logo" />
	// 	<Route path='/Pages/' element="HomePage"/>
	// 	<h1>Ft_trancendence <br/>
	// /*		<AuthToken token={token} setToken={setToken} setCookie={setCookie} cookies={cookies}/>
	// 		<button onClick={getAuth}>tssss</button>*/
	// 	</h1>
		
	// 	<h5>ca c est cheum</h5>
	// 	<p>
	// 	on vas test des truc 
	// 	<a href="https://reactjs.org" > BITE</a>
	// 	</p>
	// 	</header>
	// 	</div>
=======
	
>>>>>>> origin/home
