import React from 'react';
import { useStore } from 'hooks/actor/useStore';
import ActorForm from 'components/Shared/Formularios/actor/ActorForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { UserPlusIcon } from '@heroicons/react/24/outline';

const Store = () => {
    const { formData, loading, alert, setAlert, handleChange, handleSubmit } = useStore();

    return (
        <div className="container mx-auto p-6">
            <PageHeader
                title="Registrar Nuevo Actor"
                icon={UserPlusIcon}
                buttonText="Volver al Listado"
                buttonLink="/actor/listar"
            />
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
                <ActorForm data={formData} handleChange={handleChange} />
                <div className="mt-8 flex justify-end">
                    <button type="submit" disabled={loading}
                        className="bg-[#E8B04B] text-black px-8 py-3 rounded-sm font-black uppercase hover:bg-[#f0c06a] transition-colors disabled:opacity-50 text-sm tracking-wide">
                        {loading ? 'Guardando...' : 'Registrar Actor'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Store;