import { XmlCompare } from './components/XmlCompare';
import { Header } from './components/Header';
import './App.css';

function App(): JSX.Element {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <XmlCompare />
      </main>
    </div>
  );
}

export default App; 