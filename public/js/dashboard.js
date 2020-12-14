$(".sidebar-dropdown > a").click(function() {
   $(".sidebar-submenu").slideUp(200);
   if (
     $(this)
       .parent()
       .hasClass("active")
   ) {
     $(".sidebar-dropdown").removeClass("active");
     $(this)
       .parent()
       .removeClass("active");
   } else {
     $(".sidebar-dropdown").removeClass("active");
     $(this)
       .next(".sidebar-submenu")
       .slideDown(200);
     $(this)
       .parent()
       .addClass("active");
   }
 });
 
 $("#close-sidebar").click(function() {
   $(".page-wrapper").removeClass("toggled");
 });
 $("#show-sidebar").click(function() {
   $(".page-wrapper").addClass("toggled");
 });

 var chart = c3.generate({
  bindto: d3.select('.real-time-printing'),
  color: {
    pattern: ['#6dc8bf', '#b8db9c', '#2abb9d', '#0b7677', '#59bd7e']
  },
  // grid: {
  //     y: {
  //       show: true
  //     }
  // },
  // legend: {
  //   show: false
  // },
    data: {
        columns: [
            ['data1', 30, 200, 200, 400, 150, 250, 200],
            // ['data2', 130, 100, 100, 200, 150, 50, 300],
            // ['data3', 230, 200, 200, 300, 250, 250, 450]
        ],
        type: 'line'
    },
    bar: {
        width: {
            ratio: 0.5 // this makes bar width 50% of length between ticks
        }
        // or
        //width: 10 // this makes bar width 100px
    }
});
