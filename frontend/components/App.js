// ❗ The ✨ TASKS inside this component are NOT IN ORDER.
// ❗ Check the README for the appropriate sequence to follow.

import React, {useState, useEffect} from 'react';
import axios from "axios";
import * as yup from "yup";
import { isValid } from 'ipaddr.js';


const e = { // This is a dictionary of validation error messages.
  // username
  usernameRequired: 'username is required',
  usernameMin: 'username must be at least 3 characters',
  usernameMax: 'username cannot exceed 20 characters',
  // favLanguage
  favLanguageRequired: 'favLanguage is required',
  favLanguageOptions: 'favLanguage must be either javascript or rust',
  // favFood
  favFoodRequired: 'favFood is required',
  favFoodOptions: 'favFood must be either broccoli, spaghetti or pizza',
  // agreement
  agreementRequired: 'agreement is required',
  agreementOptions: 'agreement must be accepted',
}

const formSchema = yup.object().shape({
  username: yup.string().required(e.usernameRequired).min(3, e.usernameMin).max(20, e.usernameMax),
  favLanguage: yup.string().required(e.favLanguageRequired).oneOf(["javascript", "rust"], e.favLanguageOptions),
  favFood: yup.string().required(e.favFoodRequired).oneOf(["broccoli", "spaghetti", "pizza"], e.favFoodOptions),
  agreement: yup.boolean().required(e.agreementRequired).oneOf([true], e.agreementOptions)
})

const values = {
  username: "",
  favLanguage: "",
  favFood: "",
  agreement: false,
} 

const errorsValues = {
  ...values, 
  agreement: ""
}

// ✨ TASK: BUILD YOUR FORM SCHEMA HERE
// The schema should use the error messages contained in the object above.

export default function App() {
  // ✨ TASK: BUILD YOUR STATES HERE
  // You will need states to track (1) the form, (2) the validation errors,
  // (3) whether submit is disabled, (4) the success message from the server,
  // and (5) the failure message from the server.

  const [formState, setFormState] = useState(values);

  const [errorState, setErrorState] = useState(errorsValues);

  const [submitDisabled, setSubmitDisabled] = useState(true);

  const [resultState, setResultState] = useState({
    message: "",
    isValid: false
  });

 
  

  const validate = (evt) => {
    const value = 
      evt.target.type === "checkbox" ? evt.target.checked : evt.target.value;
    yup
      .reach(formSchema, evt.target.name)
      .validate(value)
      .then((valid) => {
        setErrorState({...errorState, [evt.target.name]: ""});
      })
      .catch((err) => {
        setErrorState({...errorState, [evt.target.name]: err.errors[0]});
        
      });
  };


  // ✨ TASK: BUILD YOUR EFFECT HERE
  // Whenever the state of the form changes, validate it against the schema
  // and update the state that tracks whether the form is submittable.
  useEffect(() => {
    formSchema.isValid(formState).then((valid) => {
      setSubmitDisabled(!valid);
    })
  }, [formState]);


  const onChange = evt => {
    // ✨ TASK: IMPLEMENT YOUR INPUT CHANGE HANDLER
    // The logic is a bit different for the checkbox, but you can check
    // whether the type of event target is "checkbox" and act accordingly.
    // At every change, you should validate the updated value and send the validation
    // error to the state where we track frontend validation errors.
    evt.persist()
    console.log("input changed", evt.target.value, evt.target.checked);
    validate(evt);
    const value = evt.target.type === "checkbox" ? evt.target.checked : evt.target.value;
    setFormState({...formState, [evt.target.name]: value });
  }

  const onSubmit = evt => {
    // ✨ TASK: IMPLEMENT YOUR SUBMIT HANDLER
    // Lots to do here! Prevent default behavior, disable the form to avoid
    // double submits, and POST the form data to the endpoint. On success, reset
    // the form. You must put the success and failure messages from the server
    // in the states you have reserved for them, and the form
    // should be re-enabled.
    evt.preventDefault();
    axios
      .post( "https://webapis.bloomtechdev.com/registration", formState)
      .then((response) => {
        setResultState({message:response.data.message, isValid:true})
        console.log(response)
      })
      .catch((error) =>  {
        setResultState({message:error.response.data.message, isValid:false})
        console.log(error)
      })
  }
console.log(resultState)
  return (
    <div> {/* TASK: COMPLETE THE JSX */}
      <h2>Create an Account</h2>
      <form onSubmit={onSubmit}>
        {resultState.message.length > 0 ?
        <h4 className={`${resultState.isValid ? "success" : "error"}`}>{resultState.message}</h4>: null}
        

        <div className="inputGroup">
          <label htmlFor="username">Username:</label>
          <input id="username" name="username" type="text" placeholder="Type Username" value={formState.username} onChange={onChange}/>
          {errorState.username.length > 0 ? 
            <div className="validation">{errorState.username}</div>: null}
        </div>

        <div className="inputGroup">
          <fieldset>
            <legend>Favorite Language:</legend>
            <label>
              <input type="radio" name="favLanguage" value="javascript" onChange={onChange} />
              JavaScript
            </label>
            <label>
              <input type="radio" name="favLanguage" value="rust" onChange={onChange}/>
              Rust
            </label>
          </fieldset>
          {errorState.favLanguage.length > 0 ? 
          <div className="validation">favLanguage is required</div>: null}
        </div>

        <div className="inputGroup">
          <label htmlFor="favFood">Favorite Food:</label>
          <select id="favFood" name="favFood" onChange={onChange}>
            <option value="">-- Select Favorite Food --</option>
            <option value="pizza">Pizza</option>
            <option value="spaghetti">Spaghetti</option>
            <option value="broccoli">Broccoli</option>
          </select>
          {errorState.favFood.length > 0 ? 
          <div className="validation">favFood is required</div>: null}
        </div>

        <div className="inputGroup">
          <label>
            <input id="agreement" type="checkbox" name="agreement" value={formState.agreement} onChange={onChange}/>
            Agree to our terms
          </label>
          {errorState.agreement.length > 0 ? 
          <div className="validation">agreement is required</div>: null}
        </div>

        <div>
          <input type="submit" disabled={submitDisabled} onChange={onChange} />
        </div>
      </form>
    </div>
  )
}
