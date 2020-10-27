export const MENUITEMS: any = [
    {
      title: "Klanten",
      children: [
        {
          title: "Klant toevoegen",
          url: "/add-client",
          icon: "add"
        },
        {
          title: "Overzicht klanten",
          url: "/clients-list",
          icon: "format_list_bulleted"
        }
      ],
      url: "",
      icon: 'people',
    },
    {
      title: "Projecten",
      children: [
        {
          title: "Project toevoegen",
          url: "/add-project",
          icon: "add"
        },
        {
          title: "Overzicht projecten",
          url: "/projects-list",
          icon: "format_list_bulleted"
        }
      ],
      url: "",
      icon: 'assignment',
    },
    {
      title: "Urenverantwoording",
      children: [
        {
          title: "Overzicht uren",
          url: "/timesheets-list",
          icon: "format_list_bulleted"
        }
      ],
      url: "",
      icon: 'watch_later',
    },
    {
      title: "Facturen",
      children: [
        {
          title: "Toevoegen",
          url: "/add-invoice",
          icon: "add"
        },
        {
          title: "Overzicht",
          url: "/invoices-list",
          icon: "format_list_bulleted"
        }
      ],
      url: "",
      icon: 'description',
    }
]
