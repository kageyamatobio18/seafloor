const fs = require('fs');
const path = require('path');

const services = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'services.json'), 'utf8')
);

/**
 * List all payment services
 */
exports.listServices = () => services;

/**
 * Search services by query (matches name, description, capabilities)
 */
exports.searchServices = (query) => {
  const q = query.toLowerCase();
  return services.filter(service => {
    const text = [
      service.name,
      service.description,
      ...(service.capabilities || [])
    ].join(' ').toLowerCase();
    return text.includes(q);
  });
};

/**
 * Get a specific service by name
 */
exports.getService = (name) => {
  return services.find(s => s.name.toLowerCase() === name.toLowerCase());
};

/**
 * Find services by capability
 */
exports.findByCapability = (capability) => {
  return services.filter(s => 
    s.capabilities && s.capabilities.includes(capability)
  );
};
