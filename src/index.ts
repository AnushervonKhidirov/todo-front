import App from './components/app.js'

const appWrapper = document.getElementById('app')

if (appWrapper) {
    const app = new App(appWrapper)
    app.init()
}

