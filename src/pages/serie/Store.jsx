import React from 'react';
import { useStore } from 'hooks/serie/useStore';
import SerieForm from 'components/Shared/Formularios/serie/SerieForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { TvIcon } from '@heroicons/react/24/outline';

const Store = () => {
    const { formData, loading, alert, setAlert, handleChange, handleSubmit } = useStore();
    return (
        <div className="container mx-auto p-6">
            <PageHeader title="Registrar Nueva Serie" icon={TvIcon} buttonText="Volver al Listado" buttonLink="/serie/listar" />
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
                <SerieForm data={formData} handleChange={handleChange} />
                <div className="mt-6 flex justify-end">
                    <button type="submit" disabled={loading}
                        className="bg-[#E8B04B] text-black px-8 py-3 rounded-sm font-black uppercase hover:bg-[#f0c06a] transition-colors disabled:opacity-50 text-sm tracking-wide">
                        {loading ? 'Guardando...' : 'Registrar Serie'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Store;