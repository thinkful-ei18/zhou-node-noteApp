/* global $ */
const api = {
  search: function (query) {
    return $.ajax({
      type: 'GET',
      url: '/v1/notes/',
      dataType: 'json',
      data: query,
    });
  },
  
  details: function (id) {
    return $.ajax({
      type: 'GET',
      dataType: 'json',
      url: `/v1/notes/${id}`,
    });
  },

  create(obj){
    return $.ajax({
      type:'POST',
      dataType:'json',
      url:'v1/notes/',
      contentType:'application/json',
      data:JSON.stringify(obj),
    });
  },
  update: function(id,obj) {
    return $.ajax({
      type:'PUT',
      dataType:'json',
      contentType:'application/json',
      url:`v1/notes/${id}`,
      data: JSON.stringify(obj),
    });
  },
  delete(id){
    return $.ajax({
      type:'DELETE',
      url:`v1/notes/${id}`,
    });
  }
  
}; 
