import AddToCalendarMixin from './add-to-calendar-mixin';

export const calendars = {
  google: {
    url: 'http://www.google.com/calendar/event?action=TEMPLATE&trp=false',
    parameters (title, location, details, start, end) {
      const parameters = {
        text: title,
        location: location,
        details: details
      };

      if (start && end) {
        parameters.dates = `${start}/${end}`;
      }

      return parameters;
    }
  },

  microsoft: {
    url: 'https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent',
    parameters (title, location, details, start, end) {
      return {
        subject: title,
        location: location,
        body: details,
        startdt: start,
        enddt: end
      };
    } 
  }
};

export default {
  props: {
    /**
     * Event title.
     * @var string
     */
    title: {
      type: String,
      default: ''
    },

    /**
     * Event location.
     * @var string
     */
    location: {
      type: String,
      default: ''
    },

    /**
     * Event details.
     * @var string
     */
    details: {
      type: String,
      default: ''
    },

    /**
     * Event start.
     * @var date
     */
    start: {
      type: Date,
      default: null
    },

    /**
     * Event end.
     * @var date
     */
    end: {
      type: Date,
      default: null
    }
  },

  data () {
    return {
      /**
       * Available calendars.
       * @param object
       */
      calendars
    };
  },

  methods: {
    /**
     * Returns generated calendar url.
     *
     * @param calendar.
     */
    calendarUrl (calendar) {
      let url = this.calendars[calendar].url;
      const parameters = this.calendars[calendar].parameters(
        this.formatString(this.title),
        this.formatString(this.location),
        this.formatString(this.details),
        calendar == 'microsoft' ? this.formatMicrosoftDate(this.start) : this.formatDate(this.start),
        calendar == 'microsoft' ? this.formatMicrosoftDate(this.end) : this.formatDate(this.end)
      );      
      for (const key in parameters) {
        if (parameters.hasOwnProperty(key) && parameters[key]) {
          url += `&${key}=${parameters[key]}`;
        }
      }      
      return url;
    },

    formatString (string) {
      return encodeURIComponent(string).replace(/%20/g, ' ');
    },

    formatDate (date) {
      return date ? date.toISOString().replace(/-|:|\.\d+/g, '') : null;
    }, 
    formatMicrosoftDate (date) {
      return date ? date.getFullYear() + "-" + 
      ('0' + (date.getMonth()+1)).slice(-2) + "-" + ('0' + date.getDate()).slice(-2) + "T" + 
      ('0' + date.getHours()).slice(-2) + ":" + ('0' + date.getMinutes()).slice(-2) + ":" + 
      ('0' + date.getSeconds()).slice(-2) : null;
    },    
  },

  mounted () {
    //
  },

  /**
   * Set component aliases for buttons and links.
   */
  components: {
    'google-calendar': {
      mixins: [AddToCalendarMixin],
      data: function () { return { calendar: 'google' }; }
    },
    'microsoft-calendar': {
      mixins: [AddToCalendarMixin],
      data: function () { return { calendar: 'microsoft' }; }
    }
  }
};
