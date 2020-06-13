<template>
    <v-container v-if="this.getUsers">
        <v-app-bar
                app
                color="primary"
                dark
        >
            <div class="d-flex align-center">
                <v-img
                        alt="Vuetify Logo"
                        class="shrink mr-2"
                        contain
                        src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
                        transition="scale-transition"
                        width="40"
                />

                <v-img
                        alt="Vuetify Name"
                        class="shrink mt-1 hidden-sm-and-down"
                        contain
                        min-width="100"
                        src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
                        width="100"
                />
            </div>
            <v-spacer></v-spacer>
            <v-btn
                    @click="addUser"
                    text
            >
                <span class="mr-2">Terminübersicht</span>
                <v-icon>mdi-account-plus</v-icon>
            </v-btn>
            <v-btn
                    @click="addUser"
                    text
            >
                <span class="mr-2">Kundenstamm</span>
                <v-icon>mdi-account-plus</v-icon>
            </v-btn>
            <v-btn
                    @click="addUser"
                    text
            >
                <span class="mr-2">Add new user</span>
                <v-icon>mdi-account-plus</v-icon>
            </v-btn>
            <v-btn
                    @click="addEvent"
                    text
            >
                <span class="mr-2">Add new event</span>
                <v-icon>mdi-calendar-clock</v-icon>
            </v-btn>
        </v-app-bar>
        <v-row v-if="this.$store.state.events.status.pending === true" class="center-v-h">
            <clip-loader :loading="loading" :color="color" :size="size"></clip-loader>
        </v-row>
        <v-row class="text-center">
            <h1 v-if="this.$store.state.events.status.fail === true" style="color:red">Error {{ this.$store.state.events.status.fail }}</h1>
        </v-row>
        <v-row class="text-center">
            <vue-cal
                    v-if="this.$store.state.events.status.pending === false"
                    class="vuecal--blue-theme"
                    style="height: auto"
                    default-view="month"
                    click-to-navigate
                    today-button
                    events-on-month-view="short"
                    :events="eventsCal"
                    :on-event-click="onEventClick"
            >
            </vue-cal>
            <!-- Show Event Dialog -->
            <v-dialog v-model="showEventDialog">
                <v-card>
                    <v-card-title>
                        <v-icon>{{ selectedEvent.icon }}</v-icon>
                        <span>{{ selectedEvent.title }}</span>
                        <v-spacer/>
                        <strong>{{ selectedEvent.startDate && selectedEvent.startDate.format('DD/MM/YYYY') }}</strong>
                    </v-card-title>
                    <v-row>
                        <v-col cols="6" md="6">
                            <v-card-text>
                                <p v-html="selectedEvent.contentFull"/>
                                <strong>Event details:</strong>
                                <ul>
                                    <li>Event starts at: {{ selectedEvent.startDate && selectedEvent.startDate.formatTime() }}</li>
                                    <li>Event ends at: {{ selectedEvent.endDate && selectedEvent.endDate.formatTime() }}</li>
                                    <li>{{ selectedEvent.id }}</li>
                                    <!-- You can also manipulate the `start` & `end` formatted strings.
                                    <li>Event starts at: {{ (selectedEvent.start || '').substring(11) }}</li>
                                    <li>Event ends at: {{ (selectedEvent.end || '').substring(11) }}</li> -->
                                </ul>
                            </v-card-text>
                        </v-col>
                        <v-col cols="6" md="6">
                            <div class="d-flex justify-end"></div>
                        </v-col>
                    </v-row>
                    <v-card-title>
                        <v-spacer/>
                        <v-btn
                                v-on:click="deleteEvent(selectedEvent.id)"
                                text
                        >
                            <span class="mr-2">Remove Event</span>
                            <v-icon>mdi-calendar-remove</v-icon>
                        </v-btn>
                    </v-card-title>
                </v-card>
            </v-dialog>
            <!-- Create Event Dialog -->
            <v-dialog v-model="showEventInputDialog">
                <v-card>
                    <v-card-title>
                        <h1>Neuer Termin</h1>
                        <v-icon></v-icon>
                        <span></span>
                        <v-spacer/>
                        <strong></strong>
                    </v-card-title>
                    <v-card-text>
                        <v-row>
                            <v-col cols="6" md="6">
                                <v-menu
                                        ref="menu1"
                                        v-model="menuStart"
                                        :close-on-content-click="false"
                                        transition="scale-transition"
                                        offset-y
                                        max-width="290px"
                                        min-width="290px"
                                >
                                    <template v-slot:activator="{ on }">
                                        <v-text-field
                                                v-model="dateStart"
                                                label="Date"
                                                hint="MM/DD/YYYY format"
                                                persistent-hint
                                                prepend-icon="mdi-calendar-export"
                                                @blur="dateStart = parseDate(dateFormattedStart)"
                                                v-on="on"
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker v-model="dateStart" no-title @input="menuStart = false"></v-date-picker>
                                </v-menu>

                                <p>Date in ISO format: <strong>{{ dateStart }}</strong></p>
                            </v-col>

                            <v-col cols="6" md="6">
                                <div v-if="selectedUser[3] === 'male'" style="max-width: 500px; height: 50px; margin-left: 30px; background-color: deepskyblue"></div>
                                <div v-if="selectedUser[3] === 'female'" style="max-width: 500px; height: 50px; margin-left: 30px; background-color: deeppink"></div>
                                <div v-else></div>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="6" md="6">
                                <v-menu
                                        ref="menuTimeStart"
                                        v-model="menuTimeStart"
                                        :close-on-content-click="false"
                                        :nudge-right="40"
                                        :return-value.sync="timeStart"
                                        transition="scale-transition"
                                        offset-y
                                        max-width="290px"
                                        min-width="290px"
                                >
                                    <template v-slot:activator="{ on }">
                                        <v-text-field
                                                v-model="timeStart"
                                                label="Wann beginnt der Termin ?"
                                                prepend-icon="mdi-clock-in"
                                                readonly
                                                v-on="on"
                                        ></v-text-field>
                                    </template>
                                    <v-time-picker
                                            v-if="menuTimeStart"
                                            v-model="timeStart"
                                            full-width
                                            format="24hr"
                                            @click:minute="$refs.menuTimeStart.save(timeStart)"
                                    ></v-time-picker>
                                </v-menu>
                            </v-col>
                            <v-col cols="6" md="6">
                                <div class="d-flex">
                                <v-menu
                                        ref="menuTimeEnd"
                                        v-model="menuTimeEnd"
                                        :close-on-content-click="false"
                                        :nudge-right="40"
                                        :return-value.sync="timeEnd"
                                        transition="scale-transition"
                                        offset-y
                                        max-width="290px"
                                        min-width="290px"
                                >
                                    <template v-slot:activator="{ on }">
                                        <v-text-field
                                                style="width: 100%"
                                                v-model="timeEnd"
                                                label="Wann endet der Termin ?"
                                                prepend-icon="mdi-clock-out"
                                                readonly
                                                v-on="on"
                                        ></v-text-field>
                                    </template>
                                    <v-time-picker
                                            v-if="menuTimeEnd"
                                            v-model="timeEnd"
                                            full-width
                                            format="24hr"
                                            @click:minute="$refs.menuTimeEnd.save(timeEnd)"
                                    ></v-time-picker>
                                </v-menu>
                                    <button @click="endTimeFilter(30)" type="button" style="margin-left: 20px" class="btn-timeEndFilter">30 Min</button>
                                    <button @click="endTimeFilter(45)" type="button" style="margin-left: 20px" class="btn-timeEndFilter">45 Min</button>
                                    <button @click="endTimeFilter(60)" type="button" style="margin-left: 20px" class="btn-timeEndFilter">60 Min</button>
                                </div>
                            </v-col>
                        </v-row>
                        {{ timeEnd }}
                        <div v-if="usersOptions">
                        <v-select
                                filled
                                color="deep-purple"
                                v-model="selectedUser"
                                :items="usersOptions"
                                :rules="itemRules"
                                label="Kunde"
                                required
                        ></v-select>
                        </div>
                        <v-text-field
                                v-model="selectedUser[0]"
                                :rules="inputRules"
                                filled
                                color="deep-purple"
                                label="Email"
                                style="min-height: 96px"
                                type="text"
                        ></v-text-field>
                        <v-text-field
                                v-model="selectedUser[2]"
                                :rules="[rules.length(6)]"
                                filled
                                color="deep-purple"
                                label="Telefon"
                                style="min-height: 96px"
                                type="text"
                        ></v-text-field>
                        <v-text-field
                                v-model="selectedUser[3]"
                                :rules="[rules.length(6)]"
                                filled
                                color="deep-purple"
                                label="Typ"
                                style="min-height: 96px"
                                type="text"
                        ></v-text-field>
                        <v-text-field
                                v-model="selectedUser[1]"
                                :rules="[rules.length(6)]"
                                filled
                                color="deep-purple"
                                label="Info"
                                style="min-height: 96px"
                                type="text"
                        ></v-text-field>
                        <strong>Event details:</strong>
                        <ul>
                            <li>Event starts at: {{ selectedEvent.startDate && selectedEvent.startDate.formatTime() }}</li>
                            <li>Event ends at: {{ selectedEvent.endDate && selectedEvent.endDate.formatTime() }}</li>
                            <!-- You can also manipulate the `start` & `end` formatted strings.
                            <li>Event starts at: {{ (selectedEvent.start || '').substring(11) }}</li>
                            <li>Event ends at: {{ (selectedEvent.end || '').substring(11) }}</li> -->
                        </ul>
                        <v-btn
                                @click="postEvent"
                                text
                        >
                            <span class="mr-2">Via Email Bestätigen</span>
                            <v-icon>mdi-calendar-plus</v-icon>
                        </v-btn>
                        <v-btn
                                @click="postEvent"
                                text
                        >
                            <span class="mr-2">Hinzufügen</span>
                            <v-icon>mdi-calendar-plus</v-icon>
                        </v-btn>
                    </v-card-text>
                </v-card>
            </v-dialog>
            <!-- Create User Dialog -->
            <v-dialog v-model="showUserInputDialog">
                <v-card>
                    <v-card-title>
                        <h1>Neuer Kunde</h1>
                        <v-icon></v-icon>
                        <span></span>
                        <v-spacer/>
                        <strong></strong>
                    </v-card-title>
                    <v-card-text>
                        <v-form
                            ref="form"
                            v-model="userInputsValid"
                            lazy-validation
                        >
                            <v-row>
                                <v-col cols="6" md="6">
                                    <v-text-field
                                            v-model="firstName"
                                            :rules="nameRules"
                                            filled
                                            color="deep-purple"
                                            label="Vorname"
                                            style="min-height: 96px"
                                            type="text"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="6" md="6">
                                    <v-text-field
                                            v-model="lastName"
                                            :rules="nameRules"
                                            filled
                                            color="deep-purple"
                                            label="Nachname"
                                            style="min-height: 96px"
                                            type="text"
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="6" md="6">
                                    <v-text-field
                                            v-model="email"
                                            :rules="emailRules"
                                            filled
                                            color="deep-purple"
                                            label="E-Mail"
                                            style="min-height: 96px"
                                            type="text"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="6" md="6">
                                    <v-text-field
                                            v-model="phone"
                                            :rules="phoneRules"
                                            filled
                                            color="deep-purple"
                                            label="Telefon"
                                            style="min-height: 96px"
                                            type="number"
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                            <v-select
                                    filled
                                    color="deep-purple"
                                    v-model="selectedClass"
                                    :items="genderOptions"
                                    :rules="itemRules"
                                    label="Haartyp"
                                    required
                            ></v-select>
                            <v-text-field
                                    v-model="contentFull"
                                    :rules="textRules"
                                    filled
                                    color="deep-purple"
                                    label="Info"
                                    style="min-height: 96px"
                                    type="text"
                            ></v-text-field>
                            <strong>Event details:</strong>
                            <ul>
                                <li>Event starts at: {{ selectedEvent.startDate && selectedEvent.startDate.formatTime() }}</li>
                                <li>Event ends at: {{ selectedEvent.endDate && selectedEvent.endDate.formatTime() }}</li>
                                <!-- You can also manipulate the `start` & `end` formatted strings.
                                <li>Event starts at: {{ (selectedEvent.start || '').substring(11) }}</li>
                                <li>Event ends at: {{ (selectedEvent.end || '').substring(11) }}</li> -->
                            </ul>
                            <v-btn
                                    :disabled="!userInputsValid"
                                    @click="postUser"
                                    text
                            >
                                <span class="mr-2">Hinzufügen</span>
                                <v-icon>mdi-calendar-plus</v-icon>
                            </v-btn>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-dialog>

        </v-row>
    </v-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  import VueCal from 'vue-cal'
  import 'vue-cal/dist/vuecal.css'
  import '../../css/cal.css'
  import ClipLoader from 'vue-spinner/src/ClipLoader'


  export default {
    components: {
        VueCal,
        ClipLoader
    },
    name: 'MainCal',
    data: vm => ({
      dateStart: new Date().toISOString().substr(0, 10),
      dateFormattedStart: vm.formatDate(new Date().toISOString().substr(0, 10)),
      menuStart: false,
      menuEnd: false,
      timeStart: null,
      timeEnd: null,
      menuTimeStart: false,
      menuTimeEnd: false,
      agreement: false,
      start: undefined,
      end: undefined,
      title: undefined,
      content: undefined,
      contentFull: undefined,
      gender: undefined,
      selectedClass: undefined,
      firstName: undefined,
      lastName: undefined,
      email: undefined,
      phone: undefined,
      genderOptions : [
          'Damenhaarschnitt',
          'Herrenhaarschnitt'
      ],
      nameRules: [
        v => !!v || 'Name is required'
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid',
      ],
      phoneRules: [
        v => !!v || 'Telefon is required'
      ],
      textRules: [
        v => !!v || 'Text is required'
      ],
      itemRules: [
        v => !!v || 'Item is required'
      ],
      inputRules: [
        v => !!v || 'Item is required'
      ],
      rules: {
        email: v => (v || '').match(/@/) || 'Please enter a valid email',
        length: len => v => (v || '').length >= len || `Invalid character length, required ${len}`,
        required: v => !!v || 'This field is required',
      },
      selectedEvent: {},
      userInputsValid: true,
      selectedUser: [],
      showEventDialog: false,
      showEventInputDialog: false,
      showUserInputDialog: false,
    //   events: [
    //     {
    //       start: '2020-04-10 10:00',
    //       end: '2020-04-10 16:00',
    //       title: 'this.name',
    //       content: 'this.user[0].info',
    //       contentFull: 'My shopping list is rather long:<br><ul><li>Avocados</li><li>Tomatoes</li><li>Potatoes</li><li>Mangoes</li></ul>',
    //       class: 'male'
    //     },
    //     {
    //       start: '2020-04-11 16:00',
    //       end: '2020-04-11 17:00',
    //       title: 'Maria',
    //       content: 'Click to see my shopping list',
    //       contentFull: 'My shopping list is rather long:<br><ul><li>Avocados</li><li>Tomatoes</li><li>Potatoes</li><li>Mangoes</li></ul>',
    //       class: 'female'
    //     },
    //     {
    //       start: '2020-04-12 14:00',
    //       end: '2020-04-12 16:00',
    //       title: 'Golf with John',
    //       content: 'Do I need to tell how many holes?',
    //       contentFull: 'Okay.<br>It will be a 18 hole golf course.',
    //       class: 'male'
    //     },
    //     {
    //       start: '2020-04-13 11:00',
    //       end: '2020-04-13 12:00',
    //       title: 'Dad\'s birthday!',
    //       content: 'Do I need to tell how many holes?',
    //       contentFull: 'Okay.<br>It will be a 18 hole golf course.',
    //       class: 'female'
    //     }
    //   ]
    }),
    computed: {
      ...mapGetters({
        getEvents: 'events',
        getUsers: 'users'
      }),
      computedDateFormatted () {
        return this.formatDate(this.date)
      },
      eventsCal () {
        if(!this.getEvents.data) return [];
        return this.getEvents.data.map((item) => {
          return {
            id: item.id,
            start: item.start,
            end: item.end,
            title: item.title,
            content: item.content,
            info: item.info,
            class: item.gender
          }
        })
      },
      usersInfo () {
        if (!this.getUsers.data) return [];
        return this.getUsers.data.map((item) => {
          return {
            id: item.id,
            firstName: item.firstName,
            lastName: item.lastName,
            email: item.email,
            phone: item.phone,
            gender: item.gender,
            info: item.contentFull
          }
        })
      },
      usersOptions () {
        if (!this.getUsers.data) return [];
          return this.getUsers.data.map((item) => {
            return {
              value: [item.email, item.info, item.phone, item.gender],
              text: item.lastName + ',' + ' ' + item.firstName
            }
          })
      }
    },
    watch: {
      date () {
        this.dateFormatted = this.formatDate(this.date)
      }
    },
    props: {
      loading: {
        type: Boolean,
        default: true
      },
      color: {
        type: String,
        default: '#42a3b9'
      },
      size: {
        type: String,
        default: '150px'
      },
      format: {
        type: [String, Number],
        default: '24h'
      }
    },
    methods: {
      postUser () {
        if(this.selectedClass === 'Herrenhaarschnitt') {
          this.selectedClass = 'male';
        } else {
          this.selectedClass = 'female';
        }
        let user = {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          phone: this.phone,
          gender: this.selectedClass,
          info: this.contentFull
        };
        console.log(user);
        this.$store.dispatch('postUsers', user);
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.phone = '';
        this.gender = null;
        this.contentFull = '';
        this.$refs.form.reset();
        this.showUserInputDialog = false;
      },
      postEvent () {
        let events = {
          start: this.dateStart + ' ' + this.timeStart,
          end:this.dateStart + ' ' + this.timeEnd,
          title: this.title,
          content: this.content,
          contentFull: this.contentFull,
          gender: 'male'
      };
        console.log('test', events);
        this.$store.dispatch('postEvents', events);
        this.showEventInputDialog = false;
        window.location.reload();
      },
      deleteEvent (id) {
        console.log(id);
        this.$store.dispatch('deleteEvents', id);
        setTimeout(function() { window.location.reload(); }, 500);
      },
      formatDate (date) {
        if (!date) return null

        const [year, month, day] = date.split('-')
        return `${month}/${day}/${year}`
      },
      parseDate (date) {
        if (!date) return null

        const [month, day, year] = date.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      },
      addEvent (e) {
        this.showEventInputDialog = true

        // Prevent navigating to narrower view (default vue-cal behavior).
        e.stopPropagation()
      },
      addUser (e) {
        this.showUserInputDialog = true

        // Prevent navigating to narrower view (default vue-cal behavior).
        e.stopPropagation()
      },
      onEventClick (event, e) {
        this.selectedEvent = event
        this.showEventDialog = true

        // Prevent navigating to narrower view (default vue-cal behavior).
        e.stopPropagation()
      },
      endTimeFilter(value) {
        const timeStartHours = this.timeStart.slice(0,2);
        const timeStartMinutes = this.timeStart.slice(-2);
        const newTimeEnd = new Date();
        newTimeEnd.setHours(timeStartHours);
        newTimeEnd.setMinutes(timeStartMinutes);
        const time = newTimeEnd.getTime() + value * 60000;
        const hours = `0${new Date(time).getHours()}`.slice(-2);
        const minutes = `0${new Date(time).getMinutes()}`.slice(-2);
        this.timeEnd = `${hours}:${minutes}`
      }
    },
    mounted() {
      this.$store.dispatch('getEvents');
      this.$store.dispatch('getUsers');
    }
  }
</script>

<style>
    .center-v-h {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .btn-timeEndFilter {
        height: 50px;
        width: 100px;
        border: 2px solid lightgrey;
        border-radius: 5px;
        text-decoration: none;
        outline: none;
    }
    .btn-timeEndFilter:hover {
        background-color: lightgrey;
        border: 2px solid lightskyblue;
    }
    .btn-timeEndFilter:active {
        background-color: lightgrey;
        border: 2px solid lightgreen;
    }
</style>
