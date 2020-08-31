export const INPUTS_VALUES = "INPUTS_VALUES";
export const CHOICE = "CHOICE";
export const DROP = "DROP";
export const CHOICES = "CHOICES";
export const PICTURE = "PICTURE";
export const DATE = "DATE";


export const init=(data)=>{

const initial={
     inputValues: {
      date:data.date,
      picture:data.picture,
      observation: data.observation,
      necessary: {
        value:  data.necessary.value,
        color:  data.necessary.color,
      },
      productName: data.productName,
      application: {
       value: data.application.value,
       avatar: data.application.avatar
      },
      spend: data.spend,
      important: {
        value: data.important.value,
        color:  data.important.color,
      },
    },
    inputValidation:{
      productName:data.productName? true: false,
      observation:true,
      spend:data.spend? true: false,
      
  
  },
  formIsValid:true
    }

return initial}


export const  inputReducer = (state, action) => {
  switch (action.type) {
    case INPUTS_VALUES:
      const updateValues = {
        ...state.inputValues,
        [action.input]: action.value,
      };
      const updateValidity = {
        ...state.inputValidation,
        [action.input]: action.isValid,
      };

      let updateFormIsValid=true
       for(const key in updateValidity)
       updateFormIsValid=updateFormIsValid && updateValidity[key]
      return {
        formIsValid:updateFormIsValid,
        inputValues: updateValues,
        inputValidation:updateValidity
      };

    case DROP:
      const updateDrop = {
        ...state.inputValues,
        application:{
          value:action.value,
          avatar:action.avatar}
      };
      return {
        ...state,
        inputValues: updateDrop,
      };
    case CHOICES:
      const updateChoices = {
        ...state.inputValues,
        important: {
          value: action.value,
          color: action.color,
        },
      };
      return {
        ...state,
        inputValues: updateChoices,
      };
      
    case DATE:
      const updateDate = {
        ...state.inputValues,
        date: action.value,
      };
      return {
        ...state,
        inputValues: updateDate,
      };
    case CHOICE:
      const updateChoice = {
        ...state.inputValues,
        necessary: {
          value: action.value,
          color: action.color,
        },
      };
      return {
        ...state,
        inputValues: updateChoice,
      };
    case PICTURE:
      const updatePic = {
        ...state.inputValues,
        picture: action.value,
      };
      return {
        ...state,
        inputValues: updatePic,
      };
  }
  return state;
};