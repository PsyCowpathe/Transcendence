
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
import { AffTheUser } from './Pages/UserModalPage';


function App() 
{
 const AuthContext = createContext(false);


	  const [isLoggedIn, setIsLoggedIn] = useState(false);

	  
	interface mabite
	{
		code : string | null;
		state : string | null
	}
	
	const [tokenForm, setToken] = useState<mabite>({state: null, code: null})


	return (
		<BrowserRouter> 
			<Routes>
		 {/* <Route path='/' element={<HomePage  tokenForm={tokenForm} setToken={setToken} onLogin={() => setIsLoggedIn(true)}/>}/>   */}

			<Route path='/change' element={<ChangeLogin/>}/> 
			<Route path='/' element={<HomePage tokenForm={tokenForm} setToken={setToken} onLogin={() => setIsLoggedIn(true)}/>}/> 
			<Route path='/chat' element={<Chat/>}/>
			{/* <Route path="/chatoune" element ={<Chat username={"Alice"} />} /> */}
			<Route path='/affUser' element={<AffMyUserPage ShowBar={true}/>}/>
			<Route path='/LoadingPage' element={<LoadingPage/>}/>
			<Route path='/changepic' element={<ProfilePictureUploader />}/>
			<Route  path='/askFriend' element={<AskFriend />}/>
			<Route path='/test' element={<IconLabelButtons />}/> 
			<Route path='/TopBar' element={<TopBar />}/> 
			{/* <Route path='/UserTest' element={<AffTheUser MyName={"test"} />}/>  */}
			<Route path='/*' element={<NotFound />}/> 
			</Routes> 
	</BrowserRouter>
		
	//	 {/* <BrowserRouter> */}
	
	//		{/* <Routes > */}
		//		{/* <Switch>
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
	