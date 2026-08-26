

const MapView = () => (
  <div className="relative h-[700px] w-full overflow-hidden rounded-2xl shadow-md">
    <iframe
      title="Map"
      width="100%"
      height="100%"
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
      src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d211800!2d151.2093!3d-33.8688!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sau!4v1700000000000!5m2!1sen!2sau"
      className="h-full w-full border-0"
    />

    <div className="absolute bottom-4 left-4 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-500 shadow backdrop-blur-sm">
      📍 Live pins will appear once the API is connected
    </div>
  </div>
);

export default MapView;