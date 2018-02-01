/* global $ */
'use strict';

const api = {
  search: function (query, callback) {
    $.ajax({
      type: 'GET',
      url: '/v1/notes/',
      dataType: 'json',
      data: query,
      success: callback
    });
  },
  
  details: function (id, callback) {
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: `/v1/notes/${id}`,
      success: callback
    });
  },

  create(obj, callback){
    $.ajax({
      type:'POST',
      dataType:'json',
      url:'v1/notes/',
      contentType:'application/json',
      data:JSON.stringify(obj),
      success: callback
    });
  },
  update: function(id,obj,callback) {
    $.ajax({
      type:'PUT',
      dataType:'json',
      contentType:'application/json',
      url:`v1/notes/${id}`,
      data: JSON.stringify(obj),
      success: callback
    });
  },
  delete(id,callback){
    $.ajax({
      type:'DELETE',
      url:`v1/notes/${id}`,
      success: callback
    });
  }
  
}; 
