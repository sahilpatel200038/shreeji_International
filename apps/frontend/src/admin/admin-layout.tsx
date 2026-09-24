import { Link, Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/api/auth";

export function AdminLayout() {
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-foreground/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <Link to="/admin" className="text-lg font-bold">
            Shreeji Tracking · Admin
          </Link>
          <div className="flex items-center gap-3">
            {/* <Link to="/admin/providers" className="text-sm font-medium text-foreground/80 hover:text-brand-red">
              Providers
            </Link> */}
            <Button variant="ghost" className="h-10 px-4 text-sm" onClick={onLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <Outlet />
      </main>
    </div>
  );
}
