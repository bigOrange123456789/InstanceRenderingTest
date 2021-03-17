var name=
    prompt(
        "Please enter a file name to process:",
        "ExhibitionHall"
    );
var myGlbHandle=new GlbHandle();
myGlbHandle.process(name);