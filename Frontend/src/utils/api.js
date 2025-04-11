export const handleApiError = (data, showAlert) => {
  if (data.errors && data.errors.length > 0) {
    data.errors.forEach((err) => {
      showAlert(err.errors?.msg || err.error?.msg || err.msg, {
        variant: "danger",
      });
    });
  } else {
    showAlert(data.error, {
      variant: "danger",
    });
  }
};
