import AppLayout from "@/components/layout/AppLayout";

export default function HomePage() {
    return (
        <AppLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-sm text-slate-500 mt-1">Resumen del negocio</p>
            </div>
        </AppLayout>
    );
}
