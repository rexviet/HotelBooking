import * as UserServices from '../services/user.services';
import {getUserBooking as getUserBookingService} from "../services/booking.services";
import globalConstants from '../globalConstants';

export async function getUserById(req, res) {
  try {
    let id, findUserPromise;

    if(req.params.id === 'me' || req.params.id === req.user._id) {
      id = req.user._id;
      findUserPromise = UserServices.findUserWithRolesById(id);
    } else {
      id = req.params.id;
      findUserPromise = UserServices.findById(id);
    }
    if (!isObjectId(id)) {
      return res.status(404).json({success: false, error: 'User not found.'});
    }

    let promises = [
      findUserPromise,
    ];
    if(req.params.id === 'me' || req.params.id === req.user._id) {
      promises.push( UserServices.getUserSummary(id) );
    }

    let resources = await Promise.all(promises);
    let user = id === req.user._id ? UserServices.formatUserRoles(resources[0]) : resources[0];

    if(!user) {
      return res.status(404).json({success: false, error: 'User not found.'});
    }

    let newAssetCount = resources[1];
    let contractCount = resources[2];
    let liquidReceiptsCount = resources[3];
    let summary = resources[4];
    delete user.password;

    return res.json({success: true, data: {user, newAssetCount, contractCount, liquidReceiptsCount, summary}});
  } catch (err) {
    err.success = false;
    err.error = err.error || 'Internal error.';
    return res.status(err.status || 500).json(err);
  }
}

export async function getUserBooking(req, res) {
  try {
    let page = Number(req.query.page || 1).valueOf();
    let userId = req.params.id;

    if(req.user._id.toString() !== userId && req.user.role !== globalConstants.userRoles.ADMIN) {
      return res.status(403).json({success: false, error: 'Permission denied.'});
    }

    let data = await getUserBookingService(userId, page);
    data.success = true;
    data.current_page = page;

    return res.status(200).json(data);
  } catch (err) {
    err.success = false;
    err.error = err.error || 'Internal error.';
    return res.status(err.status || 500).json(err);
  }
}
