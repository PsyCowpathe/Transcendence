



import React from "react";
import { ChangeLogin } from "./LoginPage";

import '../css/Force.css'

export function TestLog() {
return (
    <div className="container">
      <h1 className="title">Welcome to our transcendence</h1>
      <h2 className="title">You Have to change your login to continue</h2>
      {/* <form className="form">
        <label>
          Name:
          <input type="text" name="name" />
        </label> */}
        <ChangeLogin/>
        {/* <br />
        <button type="submit">Submit</button>
      </form> */}
    </div>
  );
}