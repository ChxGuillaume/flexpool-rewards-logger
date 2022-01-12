db.createUser({
  user: 'flexpool-reward',
  pwd: 'flexpool-reward',
  roles: [
    {
      role: 'readWrite',
      db: 'flexpool-reward',
    },
  ],
});
