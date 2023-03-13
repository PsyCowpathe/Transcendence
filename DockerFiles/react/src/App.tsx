
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



function App() 
{
 const AuthContext = createContext(false);


	// const ProfilePicturePage = () => {
	// 	const handleSubmit = (formData: FormData) => {
	// 	  // Submit form data to backend API
	// 	};
	  
	// 	return (
	// 	  <div>
	// 		<h1>Profile Picture</h1>
	// 		{/* <ProfilePictureForm onSubmit={handleSubmit} /> */}
	// 	  </div>
	// 	);
	//   };
	  const [isLoggedIn, setIsLoggedIn] = useState(false);

	  


	//const [cookies, setCookie] = useCookies(['token']);

	interface mabite
	{
		code : string | null;
		state : string | null
	}
	
	const [tokenForm, setToken] = useState<mabite>({state: null, code: null})

	//ade3b5ea214ca737f53ce0bce98938c2.jpg
	return (
		<BrowserRouter> 
		<AuthContext.Provider value={isLoggedIn}>
		<div className="App">
		 
		  {isLoggedIn ? <ChangeLogin /> : <HomePage tokenForm={tokenForm} setToken={setToken} onLogin={() => setIsLoggedIn(true)} />}

		  <LoadingPage />
		</div>
	  </AuthContext.Provider>
		
			<Routes>
		 {/* <Route path='/' element={<HomePage  tokenForm={tokenForm} setToken={setToken} onLogin={() => setIsLoggedIn(true)}/>}/>   */}

			<Route path='/change' element={<ChangeLogin/>}/> 
			{/* <Route path='/chat' element={<Chat/>}/> */}
			{/* <Route path="/chatoune" element ={<Chat username={"Alice"} />} /> */}
			{/* <Route path='/affUser' element={<AffMyUserPage/>}/>*/}
			<Route path='/LoadingPage' element={<LoadingPage/>}/>
			{/* <Route path='/changepic' element={<ProfilePicturePage />}/> */}
			<Route  path='/askFriend' element={<AskFriend />}/>
			<Route path='/test' element={<IconLabelButtons />}/> 
				</Routes> 
		</BrowserRouter> 
	
		
		//  <nav className="topbar">
		// <li><MyNavLink to="/" label="Login"/></li>
		// <li><MyNavLink to="/change" label="change your login"/></li>
		//  <li><MyNavLink to="/chat" label="chat"/></li> 
		//  <li><MyNavLink to="/chatoune" label="chatTest"/></li> 
		//  <li><MyNavLink to="/affUser" label="My User page"/></li>
		// <li><MyNavLink to="/changepic" label="change my pic"/></li>
		// <li><MyNavLink to="/askFriend" label="demande d ami"/></li>
		// <li><MyNavLink to="/test" label="test"/></li>
		// </nav>  
		// <BrowserRouter>
	
		//	{/* <Routes > */}
	//			{/* <Switch>
     //   <Route exact path="/">
      //    {<HomePage  tokenForm={tokenForm} setToken={setToken}/>}
    //    </Route>
    ////    <Route path="/change">/
       //   {<ChangeLogin/>}
       // </Route>
       // <Route path="/chat">
       //   {<Chat/>}
        //</Route>
	//	<Route path='/affUser'>
   //       {<AffMyUserPage/>}
    //    </Route>
   //   </Switch> */}
	//		{/* <Route path='/' element={<HomePage  tokenForm={tokenForm} setToken={setToken}/>}/>  */}
//{/* 			
//			<Route path='/change' element={<ChangeLogin/>}/> 
//			{/* <Route path='/chat' element={<Chat/>}/> */}
//			{/* <Route path="/chatoune" element ={<Chat username={"Alice"} />} /> */}
//			{/* <Route path='/affUser' element={<AffMyUserPage/>}/>
//			<Route path='/LoadingPage' element={<LoadingPage/>}/>
//			<Route path='/changepic' element={<ProfilePicturePage />}/>
//			<Route  path='/askFriend' element={<AskFriend />}/>
//			<Route path='/test' element={<IconLabelButtons />}/> */}
//			{/* </Routes> 
//		</BrowserRouter> */}

		
		);
}
	
	export default App;
	


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
	// 	</div>23.