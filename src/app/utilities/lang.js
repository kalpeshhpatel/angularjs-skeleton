/**
 * All status messages
 *
 * require it in controller and use like
 * eg. lang.login_success.message
 */
APP.constant('lang',{

    server_error_500: {
        title: "Server Error",
        message: "There was problem in server communication. Please try again later"
    },
    login_success : {
        title : 'Login Success',
        message : 'Login Success'
    },
    login_failed : {
        title: 'Login Faied',
        message: 'Invalid username or password'
    },
    server_error : {
        title: 'Internel server error',
        message: 'There is some problem in communicating with server. Please try again later'
    },
    forgot_password_success : {
        title: 'Success',
        message: 'An email with instruction to reset your password has been sent to your email address'
    },
    forgot_password_failed : {
        title: 'Success',
        message: 'Operation failed'
    },
    reset_password_success : {
        title: 'Success',
        message: 'Your password has been reset successfully'
    },
    reset_password_failed : {
        title: 'Success',
        message: 'Openration failed'
    },
    upload_valid_image_files : {
        title: 'Error',
        message: 'Please upload valid image files only'
    },
    upload_valid_pdf_files : {
        title: 'Error',
        message: 'Please upload PDF files only'
    },
    invalid_data : {
        title: "Invalid Data",
        message: "Invalid Data"
    },
    invalid_form: {
        title: "Invalid Form",
        message: "Please make sure you have filled all required fields before you continue"
    },
    signup_complete : {
        title: "Sign up completed",
        message: "Congratulations! Sign up is completed. Please login to continue"
    }


});