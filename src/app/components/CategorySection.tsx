interface Category {
  id: number;
  name: string;
  image: string;
}

interface CategorySectionProps {
  categories: Category[];
}

export function CategorySection({ categories }: CategorySectionProps) {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl mb-8">카테고리</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <div 
              key={category.id}
              className="group cursor-pointer"
            >
              <div className="aspect-square bg-gray-100 rounded-full overflow-hidden mb-3">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <p className="text-center text-sm">{category.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
