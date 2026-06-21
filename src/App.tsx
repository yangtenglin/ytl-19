import Header from './components/Header';
import ResourcePanel from './components/ResourcePanel';
import MarshallingYard from './components/MarshallingYard';
import ValidationPanel from './components/ValidationPanel';
import PlanDrawer from './components/PlanDrawer';
import SaveNameDialog from './components/SaveNameDialog';

export default function App() {
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden font-mono text-coal-100">
      <Header />
      <main className="flex-1 flex overflow-hidden min-h-0">
        <ResourcePanel />
        <MarshallingYard />
        <ValidationPanel />
      </main>
      <PlanDrawer />
      <SaveNameDialog />
    </div>
  );
}
