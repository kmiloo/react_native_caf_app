import React from "react";
import { Calendar } from "react-native-calendars";
import { LocaleConfig } from "react-native-calendars";

// Configuración de idioma en español
LocaleConfig.locales["es"] = {
  monthNames: [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ],
  monthNamesShort: [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ],
  dayNames: [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ],
  dayNamesShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
  today: "Hoy",
};

LocaleConfig.defaultLocale = "es";

export default function CustomCalendar({ markedDates }) {
  return (
    <Calendar
      style={{
        borderWidth: 1,
        borderColor: "blue",

        width: 300,
        borderRadius: 10,
        marginTop: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0.1 },
        shadowOpacity: 0.8,
        shadowRadius: 1,
        elevation: 5,
        alignSelf: "center",
      }}
      monthFormat={"MMMM yyyy"}
      hideExtraDays={true}
      firstDay={1}
      theme={{
        calendarBackground: "#ffffff",
        textSectionTitleColor: "#b6c1cd",
        selectedDayBackgroundColor: "#00adf5",
        selectedDayTextColor: "#ffffff",
        todayTextColor: "#00adf5",
        dayTextColor: "#2d4150",
        textDisabledColor: "#d9e1e8",
        dotColor: "#00adf5",
        selectedDotColor: "#ffffff",
        arrowColor: "black",
        disabledArrowColor: "#d9e1e8",
        monthTextColor: "blue",
        indicatorColor: "blue",
        textDayFontFamily: "monospace",
        textMonthFontFamily: "monospace",
        textDayHeaderFontFamily: "monospace",
        textDayFontWeight: "300",
        textMonthFontWeight: "bold",
        textDayHeaderFontWeight: "300",
        textDayFontSize: 16,
        textMonthFontSize: 16,
        textDayHeaderFontSize: 16,
      }}
      markingType={"dot"} // Usar multi-dot para mostrar puntos
      markedDates={markedDates} // Pasar las fechas marcadas
    />
  );
}
