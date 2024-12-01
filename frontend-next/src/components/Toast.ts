// A simple toast notification system
const toast = {
  success: (message: string) => {
    // You can replace this with a more sophisticated toast library if needed
    alert(message);
  },
  error: (message: string) => {
    alert(message);
  }
};

export default toast;
