// Einmaliges Anlegen des Beispiel-Trips "Westafrika" beim ersten Start.
const Seed = {
  async run() {
    const flag = await DB.get('settings', 'seeded');
    if (flag && flag.value) return;
    const trips = await DB.getAll('trips');
    if (trips.length === 0) {
      await Trips.save({
        name: 'Westafrika',
        startDate: '2026-12-25',
        endDate: '2027-01-08',
        budget: 2000,
        countries: ['MA', 'MR', 'CV'],
      });
    }
    await DB.put('settings', { key: 'seeded', value: true });
  },
};
