import { Habit } from "./components/Habits";

function App() {
  // prettier-ignore
  return (
  <div>
    <Habit completed={3}/>
    <Habit completed={10}/>
    <Habit completed={2}/>
    <Habit completed={41241241}/>
    <Habit completed={33}/>
    <Habit completed={333333}/>
  </div>);
}

export default App;
