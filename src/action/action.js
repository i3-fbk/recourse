export const UPDATE_INPUT_VALUE = 'UPDATE_INPUT_VALUE';
export const UPDATE_SCALER_VALUE = 'UPDATE_SCALER_VALUE';
export const SAVE_USER_ID = 'SAVE_USER_ID';
export const SAVE_USER_INFORMATION = 'SAVE_USER_INFORMATION';

export const updateInputValue = (value) => ({
  type: UPDATE_INPUT_VALUE,
  payload: value,
});

export const updateScalerValue = (value) => ({
  type: UPDATE_SCALER_VALUE,
  payload: value,
});

export const saveUserId = (value) => ({
  type: SAVE_USER_ID,
  payload: value,
});

export const saveUserInformation = (value) => ({
  type: SAVE_USER_INFORMATION,
  payload: value,
});


