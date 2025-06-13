import { bootstrapApplication } from '@angular/platform-browser'
import { App } from './app/app'
import {config} from './app/app.config.server'


const bootstrap = () => bootstrapApplication(App, config)

export default bootstrap

// This function is required for prerendering parameterized routes like 'artists/:id'
// It tells the build process which specific parameters (artist IDs) to use
// to generate static HTML files for those routes.
