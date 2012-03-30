<?php

/**
 * @file
 *  Admin callbacks.
 */

/**
 * Form constructor for the GottaGo API settings form.
 */
function gottago_admin() {
  $form['gottago_stationboard_url'] = array(
    '#type' => 'textfield',
    '#title' => t('Stationboard API URL'),
    '#description' => t('The API URL of the stationboard, like: http://transport.opendata.ch/api.php/v1/stationboard'),
    '#default_value' => variable_get('gottago_stationboard_url', 'http://transport.opendata.ch/api.php/v1/stationboard'),
  );
  return system_settings_form($form);
}