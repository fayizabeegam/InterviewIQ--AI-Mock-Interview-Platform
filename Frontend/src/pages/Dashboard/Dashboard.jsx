import DashboardLayout from "../../components/layout/DashboardLayout";
import Container from "../../components/common/Container";
import PageHeader from "../../components/common/PageHeader";

function Dashboard() {
  return (
    <DashboardLayout>

      <Container>

        <PageHeader
          title="Dashboard"
          subtitle="Welcome back!"
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-xl bg-white p-6 shadow">
            Card
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            Card
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            Card
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            Card
          </div>

        </div>

      </Container>

    </DashboardLayout>
  );
}

export default Dashboard;