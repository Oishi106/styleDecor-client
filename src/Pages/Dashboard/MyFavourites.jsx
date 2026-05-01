import React from 'react';
import { useFavorites } from '../../context/FavoritesProvider';
import ServiceCard from '../../components/ServiceCard';
import DecoratorCard from '../../components/DecoratorCard';

const MyFavourites = () => {
  const { favorites, loading } = useFavorites();

  if (loading) {
    return <div className="p-6 text-center text-xl">Loading your favourites...</div>;
  }

  if (!favorites || favorites.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold">My Favourites</h2>
        <p className="mt-4 text-base-content/70">You have no favourites yet.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">My Favourites ({favorites.length})</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((f) => (
          <div key={f._id || f.id || f.itemId || f.serviceId} className="w-full">
            {f.itemType === 'decorator' ? (
              <DecoratorCard
                id={f.itemId || f.serviceId}
                name={f.name}
                image={f.image}
                rating={f.rating || 0}
                reviews={f.reviews || 0}
                location={f.location || ''}
                specialization={f.specialization || ''}
                bio={f.bio || ''}
                specialties={f.specialties || []}
                experience={f.experience || ''}
                projects={f.projects || []}
              />
            ) : (
              <ServiceCard
                _id={f.itemId || f.serviceId}
                service_name={f.name}
                price={f.price}
                image={f.image}
                category={f.category || 'Favourite'}
                short_description={f.short_description || f.description || f.meta?.description || ''}
                rating={f.rating || 0}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyFavourites;