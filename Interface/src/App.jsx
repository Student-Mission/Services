import './App.css'
import { BrowserRouter } from 'react-router-dom';
import MyRouter from './services/Routes';
import { ThemeProvider } from './contexts/Theme';
import { GlobalProvider } from './contexts/Global';

function App() {

	return (
		<BrowserRouter>
			<GlobalProvider>
				<ThemeProvider>
					<MyRouter/>
				</ThemeProvider>
			</GlobalProvider>
		</BrowserRouter>
	)
}

export default App;
