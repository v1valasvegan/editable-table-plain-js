export default () =>
  new Promise((resolve) =>
    setTimeout(
      () => resolve([
        {
          id: 0,
          name: 'Mark Cukerberge',
          phone: '+66666666',
        },
        {
          id: 1,
          name: 'Williame Geitz',
          phone: '+1313131313',
        },
        {
          id: 2,
          name: 'Ilona Mozg',
          phone: '+123581321',
        },
        {
          id: 3,
          name: 'Sergueiy Zuckerbrin',
          phone: '+17181920',
        },
      ]),700
    )
  );
