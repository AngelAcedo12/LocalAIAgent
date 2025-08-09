import React, { useState } from 'react'

interface Model {
  name: string;
  endpoint: string;
  apiKey?: string;
}

export default function ModelsPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [newModel, setNewModel] = useState<Model>({
    name: '',
    endpoint: '',
    apiKey: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModels([...models, newModel]);
    setNewModel({ name: '', endpoint: '', apiKey: '' });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Modelos</h1>

      <form onSubmit={handleSubmit} className="mb-8 space-y-4 max-w-md">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Nombre del Modelo
          </label>
          <input
            type="text"
            id="name"
            value={newModel.name}
            onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="endpoint" className="block text-sm font-medium mb-1">
            Endpoint
          </label>
          <input
            type="url"
            id="endpoint"
            value={newModel.endpoint}
            onChange={(e) => setNewModel({ ...newModel, endpoint: e.target.value })}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium mb-1">
            API Key (opcional)
          </label>
          <input
            type="password"
            id="apiKey"
            value={newModel.apiKey}
            onChange={(e) => setNewModel({ ...newModel, apiKey: e.target.value })}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Añadir Modelo
        </button>
      </form>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {models.map((model, index) => (
          <div key={index} className="p-4 border rounded-md shadow">
            <h3 className="font-bold">{model.name}</h3>
            <p className="text-sm text-gray-600">{model.endpoint}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
