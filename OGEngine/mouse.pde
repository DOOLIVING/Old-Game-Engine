public boolean mouse_state = false;
public String type_cursor;
public void mouse(){
 if(mouse_state == true) noCursor();
 
 if(type_cursor == "Cross") cursor(CROSS);
 if(type_cursor == "Hand") cursor(HAND);
 if(type_cursor == "Move") cursor(MOVE);
 if(type_cursor == "Text") cursor(TEXT);
 if(type_cursor == "Wait") cursor(WAIT);
 if(type_cursor == "Arrow") cursor(ARROW);
}
