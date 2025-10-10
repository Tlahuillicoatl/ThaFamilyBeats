import Layout from '../Layout';

export default function LayoutExample() {
  return (
    <Layout>
      <div className="p-8 text-center">
        <h1 className="text-4xl font-display font-bold mb-4">Layout Example</h1>
        <p className="text-muted-foreground">This shows the navigation and footer layout.</p>
      </div>
    </Layout>
  );
}
