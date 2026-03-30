'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { 
  Plus, 
  Search, 
  FileText, 
  Copy, 
  Edit2, 
  Trash2,
  Eye,
  Tags,
  Sparkles,
  Clock,
  Heart,
  Gift,
  Megaphone,
  TrendingUp
} from 'lucide-react';

const categories = [
  { id: 'all', name: 'Todos', icon: FileText },
  { id: 'promo', name: 'Promociones', icon: Gift },
  { id: 'launch', name: 'Lanzamientos', icon: Sparkles },
  { id: 'engagement', name: 'Engagement', icon: Heart },
  { id: 'announcement', name: 'Anuncios', icon: Megaphone },
  { id: 'tip', name: 'Tips', icon: TrendingUp },
];

const templates = [
  {
    id: '1',
    title: 'Lanzamiento de Producto',
    description: 'Plantilla para anunciar el lanzamiento de un nuevo producto o servicio.',
    category: 'launch',
    content: '🎉 ¡Tenemos algo emocionante que compartir! 🚀\n\nPresentamos {{product_name}}, la solución que transformará tu forma de {{use_case}}.\n\n✨ Características principales:\n• {{feature_1}}\n• {{feature_2}}\n• {{feature_3}}\n\n🛒 ¡Ordena ahora y obtén {{offer}}!\n\n#{{hashtag}} #Lanzamiento #Nuevo',
    variables: ['product_name', 'use_case', 'feature_1', 'feature_2', 'feature_3', 'offer', 'hashtag'],
    usageCount: 45,
    lastUsed: '2024-03-28',
    platforms: ['facebook', 'instagram', 'twitter', 'linkedin']
  },
  {
    id: '2',
    title: 'Promoción de Fin de Semana',
    description: 'Genera urgencia con esta plantilla de promoción limitada.',
    category: 'promo',
    content: '⚡ ¡OFERTA DE FIN DE SEMANA! ⚡\n\nSolo por {{duration}}, disfruta de {{discount}}% de descuento en {{product_category}}.\n\n🎁 Código: {{promo_code}}\n⏰ Válido hasta: {{end_date}}\n\n¡No te lo pierdas!\n\n#Oferta #FinDeSemana #Descuento',
    variables: ['duration', 'discount', 'product_category', 'promo_code', 'end_date'],
    usageCount: 78,
    lastUsed: '2024-03-29',
    platforms: ['facebook', 'instagram']
  },
  {
    id: '3',
    title: 'Engagement: Pregunta a tu Audiencia',
    description: 'Plantilla para generar interacción y conocer a tu comunidad.',
    category: 'engagement',
    content: '👋 ¡Hola comunidad!\n\nQueremos conocerte mejor. Cuéntanos:\n\n{{question}}\n\n💬 Déjanos tu respuesta en los comentarios.\n\n{{motivational_quote}}',
    variables: ['question', 'motivational_quote'],
    usageCount: 92,
    lastUsed: '2024-03-27',
    platforms: ['instagram', 'facebook', 'twitter']
  },
  {
    id: '4',
    title: 'Testimonio de Cliente',
    description: 'Comparte testimonios de clientes satisfechos.',
    category: 'announcement',
    content: '⭐ HISTORIA DE ÉXITO ⭐\n\n"{{customer_testimonial}}" - {{customer_name}}\n\n{{customer_name}} pasó de {{before_situation}} a {{after_situation}} gracias a {{solution}}.\n\n¿Quieres ser el próximo? 👇\n\n#Testimonio #Éxito #ClienteFeliz',
    variables: ['customer_testimonial', 'customer_name', 'before_situation', 'after_situation', 'solution'],
    usageCount: 34,
    lastUsed: '2024-03-25',
    platforms: ['facebook', 'linkedin', 'twitter']
  },
  {
    id: '5',
    title: 'Tip del Día',
    description: 'Comparte consejos útiles con tu audiencia.',
    category: 'tip',
    content: '💡 TIP DEL DÍA\n\n¿Sabías que {{tip_content}}?\n\n{{additional_explanation}}\n\n¡Comparte con alguien que lo necesite! 🔄\n\n#Tips #Consejos #Aprende',
    variables: ['tip_content', 'additional_explanation'],
    usageCount: 156,
    lastUsed: '2024-03-29',
    platforms: ['instagram', 'twitter', 'facebook']
  },
];

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<typeof templates[0] | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(c => c.id === categoryId) || categories[0];
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    alert('¡Plantilla copiada al portapapeles!');
  };

  return (
    <div>
      <Header 
        title="Plantillas" 
        description="Plantillas prediseñadas para tus publicaciones"
        action={{
          label: 'Nueva Plantilla',
          onClick: () => setShowCreateModal(true)
        }}
      />
      
      <div className="p-6 space-y-6">
        <div className="flex gap-4 overflow-x-auto pb-2">
          {categories.map((category) => {
            const Icon = category.icon;
            const count = category.id === 'all' 
              ? templates.length 
              : templates.filter(t => t.category === category.id).length;
            
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 whitespace-nowrap transition-all ${
                  selectedCategory === category.id 
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                    : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{category.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  selectedCategory === category.id 
                    ? 'bg-emerald-200 text-emerald-800' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar plantillas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {filteredTemplates.map((template) => {
              const categoryInfo = getCategoryInfo(template.category);
              const CategoryIcon = categoryInfo.icon;
              
              return (
                <div 
                  key={template.id}
                  className="border border-gray-200 rounded-xl hover:shadow-lg hover:border-emerald-200 transition-all p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <CategoryIcon className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-xs font-medium text-gray-500">{categoryInfo.name}</span>
                    </div>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => {
                          setSelectedTemplate(template);
                          setShowPreviewModal(true);
                        }}
                        className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-1">{template.title}</h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{template.description}</p>

                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <p className="text-xs text-gray-600 whitespace-pre-wrap line-clamp-4">
                      {template.content}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {template.platforms.map((platform) => (
                        <span 
                          key={platform}
                          className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs capitalize"
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {template.usageCount} usos
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {template.lastUsed}
                      </span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(template.content)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 text-white text-xs font-medium rounded-lg hover:bg-emerald-600 transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                      Usar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay plantillas</h3>
              <p className="text-gray-500 mb-4">Crea tu primera plantilla para comenzar</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-cyan-700 transition-all"
              >
                <Plus className="w-5 h-5" />
                Nueva Plantilla
              </button>
            </div>
          )}
        </div>
      </div>

      {showPreviewModal && selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowPreviewModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden m-4">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedTemplate.title}</h2>
                  <p className="text-sm text-gray-500 mt-1">{selectedTemplate.description}</p>
                </div>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                  {selectedTemplate.content}
                </pre>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Variables disponibles:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.variables.map((variable) => (
                    <span 
                      key={variable}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-mono"
                    >
                      {`{{${variable}}}`}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Plataformas compatibles:</h4>
                <div className="flex gap-2">
                  {selectedTemplate.platforms.map((platform) => (
                    <span 
                      key={platform}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm capitalize"
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => copyToClipboard(selectedTemplate.content)}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-cyan-700 transition-all flex items-center justify-center gap-2"
              >
                <Copy className="w-5 h-5" />
                Copiar y Usar
              </button>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 font-medium rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCreateModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden m-4">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Nueva Plantilla</h2>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título de la plantilla
                </label>
                <input
                  type="text"
                  placeholder="Ej: Promoción de Verano"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe brevemente para qué se usa esta plantilla..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría
                </label>
                <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all">
                  <option value="">Selecciona una categoría</option>
                  {categories.filter(c => c.id !== 'all').map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contenido
                </label>
                <textarea
                  rows={8}
                  placeholder="Escribe el contenido de tu plantilla. Usa {{variable}} para insertar variables..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none font-mono text-sm"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> Usa <code className="bg-blue-100 px-1 rounded">{'{{nombre_variable}}'}</code> para crear variables que se reemplazarán al usar la plantilla.
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 font-medium rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-cyan-700 transition-all"
              >
                Crear Plantilla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
