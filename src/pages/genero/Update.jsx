import React from 'react';
import { useUpdate } from 'hooks/genero/useUpdate';
import GeneroForm from 'components/Shared/Formularios/genero/GeneroForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

const Update = () => {
    const { formData, loading, saving, alert, setAlert, handleChange, handleSubmit, navigate } = useUpdate();

    if (loading) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-6">
            <PageHeader
                title="Editar Género"
                subtitle={`Editando: ${formData.nombre}`}
                icon={PencilSquareIcon}
                buttonText="← Volver al listado"
                buttonLink="/genero/listar"
            />
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
                <GeneroForm data={formData} handleChange={handleChange} />
                <div className="flex justify-end gap-4 mt-8">
                    <button type="button" onClick={() => navigate('/genero/listar')}
                        className="px-6 py-3 bg-white/5 text-white/60 rounded-sm font-bold hover:bg-white/10 transition-colors uppercase text-xs tracking-wide border border-white/10">
                        Cancelar
                    </button>
                    <button type="submit" disabled={saving}
                        className="bg-[#E8B04B] text-black px-10 py-3 rounded-sm font-black uppercase hover:bg-[#f0c06a] transition-all disabled:opacity-50 text-sm tracking-wide">
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Update;