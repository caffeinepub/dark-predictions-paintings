import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";

actor {
  include MixinStorage();

  public type PaintingId = Text;
  public type Price = Nat;

  public type Painting = {
    id : PaintingId;
    title : Text;
    description : Text;
    price : Price;
    images : [Storage.ExternalBlob];
    contactEmail : Text;
  };

  module Painting {
    public func compare(painting1 : Painting, painting2 : Painting) : Order.Order {
      switch (Text.compare(painting1.id, painting2.id)) {
        case (#equal) { Text.compare(painting1.title, painting2.title) };
        case (order) { order };
      };
    };
  };

  public type UserProfile = {
    name : Text;
  };

  let paintings = Map.empty<PaintingId, Painting>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let contactEmail = "offgridsecrets@gmail.com";

  // Access control integration
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User profile functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Admin functions
  public shared ({ caller }) func addPainting(id : PaintingId, title : Text, description : Text, price : Price, images : [Storage.ExternalBlob]) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add paintings");
    };

    let painting : Painting = {
      id;
      title;
      description;
      price;
      images;
      contactEmail;
    };

    paintings.add(id, painting);
  };

  public shared ({ caller }) func updatePainting(id : PaintingId, updatedTitle : Text, updatedDescription : Text, updatedPrice : Price, updatedImages : [Storage.ExternalBlob]) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update paintings");
    };

    let existingPainting = switch (paintings.get(id)) {
      case (null) { Runtime.trap("Painting not found") };
      case (?painting) { painting };
    };

    let updatedPainting : Painting = {
      id = existingPainting.id;
      title = updatedTitle;
      description = updatedDescription;
      price = updatedPrice;
      images = updatedImages;
      contactEmail = existingPainting.contactEmail;
    };

    paintings.add(id, updatedPainting);
  };

  public shared ({ caller }) func deletePainting(id : PaintingId) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete paintings");
    };

    if (not paintings.containsKey(id)) {
      Runtime.trap("Painting not found");
    };

    paintings.remove(id);
  };

  // Public functions
  public query ({ caller }) func getAllPaintings() : async [Painting] {
    paintings.values().toArray().sort();
  };

  public query ({ caller }) func getPainting(id : PaintingId) : async ?Painting {
    paintings.get(id);
  };

  public query ({ caller }) func getContactEmail() : async Text {
    contactEmail;
  };
};
