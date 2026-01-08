import './App.css';
import BrushSettings from './components/BrushSettings';
import Canvas from './components/Canvas';

function App() {
  return (
    <main className="app">
      <div className="app__canvas">
        <Canvas />
      </div>

      <div className="app__brush-settings">
        <BrushSettings />
      </div>
    </main>
  );
}

export default App;
