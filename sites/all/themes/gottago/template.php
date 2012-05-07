<?php

/**
 * @file
 * This file is empty by default because the base theme chain (Alpha & Omega) provides
 * all the basic functionality. However, in case you wish to customize the output that Drupal
 * generates through Alpha & Omega this file is a good place to do so.
 *
 * Alpha comes with a neat solution for keeping this file as clean as possible while the code
 * for your subtheme grows. Please read the README.txt in the /preprocess and /process subfolders
 * for more information on this topic.
 */

/**
 * Implements hook_form_alter().
 */
function gottago_form_alter(&$form, &$form_state, $form_id) {
  drupal_add_js(drupal_get_path('theme', 'gottago') .'/js/jquery.html5form.js');
  drupal_add_js(drupal_get_path('theme', 'gottago') .'/js/gottagoForm.js');
}

/**
 * Theme the password description of the user login form
 * and the user login block.
 */
function gottago_lt_password_description($variables) {
  switch ($variables['form_id']) {
    case 'user_login':
      // The password field's description on the /user/login page.
      return l(t('Request new password'), 'user/password');
      break;
  }
}

/**
 * Theme the username description of the user login form
 * and the user login block.
 */
function gottago_lt_username_description($variables) {
  switch ($variables['form_id']) {
    case 'user_login':
      // The username field's description when shown on the /user/login page.
      return '';
      break;
  }
}

/**
 * Theme the username title of the user login form
 * and the user login block.
 */
function gottago_lt_username_title($variables) {
  switch ($variables['form_id']) {
    case 'user_login':
      // Label text for the username field on the /user/login page.
      return t('E-mail address');
      break;

    case 'user_login_block':
      // Label text for the username field when shown in a block.
      return t('E-mail');
      break;
  }
}

function gottago_preprocess_html(){
	drupal_add_js('
		var is_ssl = ("https:" == document.location.protocol);
  		var asset_host = is_ssl ? "https://d3rdqalhjaisuu.cloudfront.net/" : "http://d3rdqalhjaisuu.cloudfront.net/";
  		document.write(unescape("%3Cscript src=\'" + asset_host + "javascripts/feedback-v2.js\' type=\'text/javascript\'%3E%3C/script%3E"));
		',
    	array('type' => 'inline')
  	);
 	drupal_add_js('
 		var feedback_widget_options = {};

		  feedback_widget_options.display = "overlay";
		  feedback_widget_options.company = "gottago";
		  feedback_widget_options.placement = "left";
		  feedback_widget_options.color = "#41A6D9";
		  feedback_widget_options.style = "problem";

  		var feedback_widget = new GSFN.feedback_widget(feedback_widget_options);
		',
    	array('type' => 'inline')
  	);
}

function gottago_links__locale_block($variables) {
  $links = $variables['links'];
  $attributes = $variables['attributes'];
  $heading = $variables['heading'];
  global $language_url;
  $output = '';

  if (count($links) > 0) {
    $output = '';

    // Treat the heading first if it is present to prepend it to the
    // list of links.
    if (!empty($heading)) {
      if (is_string($heading)) {
        // Prepare the array that will be used when the passed heading
        // is a string.
        $heading = array(
          'text' => $heading,
          // Set the default level of the heading. 
          'level' => 'h2',
        );
      }
      $output .= '<' . $heading['level'];
      if (!empty($heading['class'])) {
        $output .= drupal_attributes(array('class' => $heading['class']));
      }
      $output .= '>' . check_plain($heading['text']) . '</' . $heading['level'] . '>';
    }

    $output .= '<ul' . drupal_attributes($attributes) . '>';

    $num_links = count($links);
    $i = 1;

    foreach ($links as $key => $link) {
      $class = array($key);

      // Add first, last and active classes to the list of links to help out themers.
      if ($i == 1) {
        $class[] = 'first';
      }
      if ($i == $num_links) {
        $class[] = 'last';
      }
      if (isset($link['href']) && ($link['href'] == $_GET['q'] || ($link['href'] == '<front>' && drupal_is_front_page()))
           && (empty($link['language']) || $link['language']->language == $language_url->language)) {
        $class[] = 'active';
      }
      $output .= '<li' . drupal_attributes(array('class' => $class)) . '>';

      if (isset($link['href'])) {
        // Pass in $link as $options, they share the same keys.
        $output .= l($link['title'], $link['href'], $link);
      }
      elseif (!empty($link['title'])) {
        // Some links are actually not links, but we wrap these in <span> for adding title and class attributes.
        if (empty($link['html'])) {
          $link['title'] = check_plain($link['title']);
        }
        $span_attributes = '';
        if (isset($link['attributes'])) {
          $span_attributes = drupal_attributes($link['attributes']);
        }
        $output .= '<span' . $span_attributes . '>' . $link['title'] . '</span>';
      }
      $output .= "</li>\n";
      if ($i != $num_links) {
        $output .= "<li>|</li>\n";
      }
      $i++;
    }

    $output .= '</ul>';
  }

  return $output;
}