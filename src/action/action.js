export const UPDATE_INPUT_VALUE = 'UPDATE_INPUT_VALUE';
export const UPDATE_SCALER_VALUE = 'UPDATE_SCALER_VALUE';

export const updateInputValue = (value) => ({
  type: UPDATE_INPUT_VALUE,
  payload: value,
});

export const updateScalerValue = (value) => ({
  type: UPDATE_SCALER_VALUE,
  payload: value,
});


